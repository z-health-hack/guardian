FROM python:3.9

WORKDIR /app

COPY Pipfile .
COPY Pipfile.lock .
COPY ./guardian .

RUN pip install pipenv
RUN pipenv install --system --deploy

ENV DJANGO_SETTINGS_MODULE guardian.settings.production

CMD python manage.py migrate \
    && python manage.py loaddata fixtures/initial_data.json \
    && exec gunicorn -b :$PORT guardian.wsgi