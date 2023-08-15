# Generated by Django 4.2.4 on 2023-08-14 17:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('profile_id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('full_name', models.CharField(max_length=255)),
                ('bio', models.CharField(blank=True, max_length=255)),
                ('avatar', models.ImageField(default='Avatar/avatar.png', upload_to='Avatar/')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=255, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='account.profile')),
            ],
        ),
    ]
