FROM python:3.7-alpine

WORKDIR /app

COPY Pipfile .
COPY Pipfile.lock .
COPY ./guardian .

RUN pip install pipenv
RUN pipenv install --system --deploy

CMD exec gunicorn -b :$PORT guardian.wsgi