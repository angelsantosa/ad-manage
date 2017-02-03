# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('document_manager', '0001_initial'),
        ('catalogue', '0009_auto_20160615_0215'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseResource',
            fields=[
                ('document_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='document_manager.Document')),
                ('product', models.ForeignKey(to='catalogue.Product')),
            ],
            bases=('document_manager.document',),
        ),
    ]
