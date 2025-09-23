<template>
  <AdminLayout>
    <div v-if="contact">
      <div class="flex flex-between mb-3">
        <h1>{{ contact.firstName }} {{ contact.lastName }}</h1>
        <div class="btn-group">
          <NuxtLink
            :to="`/admin/contacts/${contact.id}/edit?return=/admin/contacts/${contact.id}`"
            class="btn btn-primary"
          >
            Edit
          </NuxtLink>
          <button @click="handleDelete" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <h3>Contact Details</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-2">
            <div>
              <p class="text-secondary text-sm">Organization</p>
              <p>
                <NuxtLink
                  v-if="contact.organizationId"
                  :to="`/admin/organizations/${contact.organizationId}`"
                >
                  {{ organization?.name || '-' }}
                </NuxtLink>
              </p>
            </div>
            <div>
              <p class="text-secondary text-sm">Position</p>
              <p>{{ contact.position || '-' }}</p>
            </div>
            <div>
              <p class="text-secondary text-sm">Department</p>
              <p>{{ contact.department || '-' }}</p>
            </div>
            <div>
              <p class="text-secondary text-sm">Email</p>
              <p>
                <a v-if="contact.email" :href="`mailto:${contact.email}`">
                  {{ contact.email }}
                </a>
                <span v-else>-</span>
              </p>
            </div>
            <div>
              <p class="text-secondary text-sm">Phone</p>
              <p>{{ contact.phone || '-' }}</p>
            </div>
            <div>
              <p class="text-secondary text-sm">Mobile</p>
              <p>{{ contact.mobile || '-' }}</p>
            </div>
            <div>
              <p class="text-secondary text-sm">Primary Contact</p>
              <p>{{ contact.isPrimary ? 'Yes' : 'No' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading"></div>
  </AdminLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const contact = ref(null)
const organization = ref(null)

onMounted(async () => {
  contact.value = await $fetch(`/api/contacts/${route.params.id}`)

  if (contact.value?.organizationId) {
    organization.value = await $fetch(`/api/organizations/${contact.value.organizationId}`)
  }
})

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this contact?')) {
    await $fetch(`/api/contacts/${route.params.id}`, {
      method: 'DELETE'
    })
    await navigateTo('/admin/contacts')
  }
}
</script>