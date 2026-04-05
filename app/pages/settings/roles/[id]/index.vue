<template>
  <RolesRoleForm
    mode="view"
    v-model:selectedPermissions="selectedPermissions"
    v-model:roleData="roleData"
    :permissionGroups="permissionGroups"
    :loading="loading"
    @cancel="handleCancel"
  />
</template>

<script setup>
definePageMeta({ fullPage: true, middleware: 'auth', adminOnly: true })
import { useRoleForm } from '~/composables/useRoleForm'

const {
  roleData,
  permissionGroups,
  selectedPermissions,
  loading,
  handleCancel
} = useRoleForm('view')
</script>
