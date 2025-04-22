from django.contrib import admin
from django.contrib.auth import get_user_model
# Register your models here.


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)
    readonly_fields = ('id',)

admin.site.register(get_user_model(), CustomUserAdmin)
