import os
import sys

SALEOR_ROOT = os.environ.get(
    "SALEOR_ROOT",
    "/app" if os.path.exists("/app/saleor") else os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "apps/saleor-core")
)
if SALEOR_ROOT not in sys.path:
    sys.path.insert(0, SALEOR_ROOT)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saleor.settings')

import django
django.setup()

from saleor.account.models import User
from saleor.site.models import SiteSettings

def sync_credentials():
    # 1. Ensure email confirmation is disabled for direct registration and login
    site_settings = SiteSettings.objects.first()
    if site_settings and site_settings.enable_account_confirmation_by_email:
        site_settings.enable_account_confirmation_by_email = False
        site_settings.save()
        print("Disabled enable_account_confirmation_by_email")

    # 2. Key accounts to lock with permanent passwords
    default_pw = os.environ.get('KYLIN_ADMIN_PASSWORD', 'KylinTattoo2026!')
    ACCOUNTS = [
        ('admin@kylintattoo.com', default_pw, True, True),
        ('admin@kylin.com', default_pw, True, True),
        ('artist@kylintattoo.com', default_pw, False, False),
        ('artist_test@kylintattoo.com', default_pw, False, False),
        ('tattoo_master_99@gmail.com', default_pw, False, False),
    ]

    for email, password, is_staff, is_superuser in ACCOUNTS:
        u, created = User.objects.get_or_create(
            email=email,
            defaults={
                'is_active': True,
                'is_confirmed': True,
                'is_staff': is_staff,
                'is_superuser': is_superuser,
            }
        )
        u.set_password(password)
        u.is_active = True
        u.is_confirmed = True
        if is_staff:
            u.is_staff = True
            u.is_superuser = is_superuser
        u.save()
        print(f"Verified {email} -> {password} (active={u.is_active}, confirmed={u.is_confirmed})")

if __name__ == '__main__':
    sync_credentials()
