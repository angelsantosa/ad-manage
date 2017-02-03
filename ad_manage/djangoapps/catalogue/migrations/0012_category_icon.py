# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalogue', '0011_auto_20160716_0224'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='icon',
            field=models.CharField(help_text=b'\xc3\x8dcono de la categor\xc3\xada', max_length=250, null=True, blank=True),
        ),
    ]
