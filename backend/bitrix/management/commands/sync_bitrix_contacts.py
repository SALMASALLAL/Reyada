import requests
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from bitrix.models import BitrixContact


class Command(BaseCommand):
    help = 'Sync contacts from Bitrix24 CRM API'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Run the command without making any database changes',
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Enable verbose output',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        verbose = options['verbose']

        # Bitrix24 API URL
        api_url = "https://b24-0r8mng.bitrix24.com/rest/17/bjw88pw8gqome9fy/crm.contact.list.json"
        params = {
            'FILTER[>DATE_CREATE]': '2019-01-01',
            'SELECT[]': ['NAME', 'LAST_NAME', 'EMAIL']
        }

        try:
            self.stdout.write(self.style.SUCCESS('Starting Bitrix24 contact sync...'))
            
            if verbose:
                self.stdout.write(f'API URL: {api_url}')
                self.stdout.write(f'Parameters: {params}')
            
            # Make API request
            response = requests.get(api_url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if 'result' not in data:
                raise CommandError('Invalid API response format')
            
            contacts = data['result']
            
            if verbose:
                self.stdout.write(f'Retrieved {len(contacts)} contacts from API')
            
            # Process contacts
            new_contacts = 0
            updated_contacts = 0
            skipped_contacts = 0
            
            with transaction.atomic():
                for contact_data in contacts:
                    # Extract contact information
                    name = contact_data.get('NAME', '').strip()
                    last_name = contact_data.get('LAST_NAME', '').strip()
                    email_list = contact_data.get('EMAIL', [])
                    
                    # Skip contacts without email
                    if not email_list or not isinstance(email_list, list):
                        skipped_contacts += 1
                        if verbose:
                            self.stdout.write(f'Skipping contact without email: {name} {last_name}')
                        continue
                    
                    # Use the first email address
                    email = email_list[0].get('VALUE', '').strip() if email_list else ''
                    
                    if not email:
                        skipped_contacts += 1
                        if verbose:
                            self.stdout.write(f'Skipping contact without valid email: {name} {last_name}')
                        continue
                    
                    if dry_run:
                        if verbose:
                            self.stdout.write(f'[DRY RUN] Would process: {name} {last_name} ({email})')
                        continue
                    
                    # Check if contact already exists
                    contact, created = BitrixContact.objects.get_or_create(
                        email=email,
                        defaults={
                            'name': name,
                            'last_name': last_name,
                        }
                    )
                    
                    if created:
                        new_contacts += 1
                        if verbose:
                            self.stdout.write(f'Created new contact: {contact}')
                    else:
                        # Update existing contact if data has changed
                        updated = False
                        if contact.name != name:
                            contact.name = name
                            updated = True
                        if contact.last_name != last_name:
                            contact.last_name = last_name
                            updated = True
                        
                        if updated:
                            contact.save()
                            updated_contacts += 1
                            if verbose:
                                self.stdout.write(f'Updated existing contact: {contact}')
                        elif verbose:
                            self.stdout.write(f'No changes for contact: {contact}')
            
            # Print summary
            if dry_run:
                self.stdout.write(
                    self.style.WARNING(
                        f'[DRY RUN] Would have processed {len(contacts)} contacts, '
                        f'skipped {skipped_contacts} without valid email'
                    )
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Sync completed successfully! '
                        f'New contacts: {new_contacts}, '
                        f'Updated contacts: {updated_contacts}, '
                        f'Skipped contacts: {skipped_contacts}'
                    )
                )
        
        except requests.RequestException as e:
            raise CommandError(f'Failed to fetch data from Bitrix24 API: {e}')
        except Exception as e:
            raise CommandError(f'Unexpected error during sync: {e}')
