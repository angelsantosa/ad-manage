# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalogue', '0010_courseresource'),
    ]

    operations = [
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
    ]
