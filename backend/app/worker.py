from celery import Celery
from .config import CELERY_BROKER_URL

celery = Celery(__name__, broker=CELERY_BROKER_URL)


@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(86400.0, fetch_dld_transactions.s(), name="daily DLD fetch")


@celery.task
def fetch_dld_transactions():
    # Placeholder: fetch Dubai Land Department transactions and upsert into Supabase.
    pass
