# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('document_manager', '0001_initial'),
        ('catalogue', '0009_auto_20160615_0303'),
    ]

    operations = [
        migrations.CreateModel(
            name='CourseResource',
            fields=[
                ('document_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='document_manager.Document')),
            ],
            bases=('document_manager.document',),
        ),
        migrations.AddField(
            model_name='category',
            name='icon',
            field=models.CharField(help_text=b'\xc3\x8dcono de la categor\xc3\xada', max_length=250, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='location_latitude',
            field=models.FloatField(default=133.7, help_text=b'Almacena la latitud de la ubicaci\xc3\xb3n', null=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='location_longitude',
            field=models.FloatField(default=133.7, help_text=b'Almacena la longitud de la ubicaci\xc3\xb3n', null=True),
        ),
        migrations.AddField(
            model_name='courseresource',
            name='product',
            field=models.ForeignKey(to='catalogue.Product'),
        ),
    ]
