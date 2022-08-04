from .celery import app


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(300.0, keep_from_idling, name='keep_me_running')


# test
@app.task
def keep_from_idling():
    return "running"
