# Generated by Django 3.1.3 on 2020-11-07 18:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_stages'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Stages',
            new_name='Stage',
        ),
    ]
