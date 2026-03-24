<template>
  <RolesRoleForm
    mode="edit"
    v-model:selectedPermissions="selectedPermissions"
    v-model:roleData="roleData"
    :permissionGroups="permissionGroups"
    :loading="loading"
    :errors="errors"
    @save-name="handleSaveName"
    @save-group="handleSaveGroup"
    @cancel="handleCancel"
  />
</template>

<script setup>
definePageMeta({ fullPage: true })
import { useRoleForm } from '~/composables/useRoleForm'

const {
  roleData,
  permissionGroups,
  selectedPermissions,
  loading,
  errors,
  handleSaveName,
  handleSaveGroup,
  handleCancel
} = useRoleForm('edit')
</script>
