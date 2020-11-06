FROM python:3.7-alpine

WORKDIR /app

COPY Pipfile .
COPY Pipfile.lock .
COPY ./guardian .

RUN pip install pipenv
RUN pipenv install --system --deploy

CMD python manage.py migrate \
    && python manage.py loaddata fixtures/initial_data.json \
    && exec gunicorn -b :$PORT guardian.wsgi