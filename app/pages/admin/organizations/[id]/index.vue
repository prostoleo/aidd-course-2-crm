<template>
  <AdminLayout>
    <div v-if="organization">
      <div class="flex flex-between mb-3">
        <h1>{{ organization.name }}</h1>
        <div class="btn-group">
          <NuxtLink
            :to="`/admin/organizations/${organization.id}/edit?return=/admin/organizations/${organization.id}`"
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
          <h3>Organization Details</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-2">
            <div>
              <p class="text-secondary text-sm">Industry</p>
              <p>{{ organization.industry || '-' }}</p>
            </div>
            <div>
              <p class="text-secondary text-sm">Website</p>
              <p>
                <a v-if="organization.website" :href="organization.website" target="_blank">
                  {{ organization.website }}
                </a>
                <span v-else>-</span>
              </p>
            </div>
            <div>
              <p class="text-secondary text-sm">Phone</p>
              <p>{{ organization.phone || '-' }}</p>
            </div>
            <div>
              <p class="text-secondary text-sm">Address</p>
              <p>
                {{ organization.address || '-' }}<br />
                {{ organization.city }}, {{ organization.state }} {{ organization.zip }}<br />
                {{ organization.country }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-between mb-3">
        <h2>Contacts</h2>
        <NuxtLink
          :to="`/admin/contacts/new?organizationId=${organization.id}`"
          class="btn btn-primary"
        >
          Add Contact
        </NuxtLink>
      </div>

      <div class="card">
        <div class="card-body">
          <table class="table" v-if="contacts.length > 0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Primary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contact in contacts" :key="contact.id">
                <td>
                  <NuxtLink :to="`/admin/contacts/${contact.id}`">
                    {{ contact.firstName }} {{ contact.lastName }}
                  </NuxtLink>
                </td>
                <td>{{ contact.position || '-' }}</td>
                <td>{{ contact.email || '-' }}</td>
                <td>{{ contact.phone || '-' }}</td>
                <td>
                  <span v-if="contact.isPrimary" class="badge badge-success">Primary</span>
                </td>
                <td>
                  <NuxtLink
                    :to="`/admin/contacts/${contact.id}/edit?return=/admin/organizations/${organization.id}`"
                    class="btn btn-sm btn-secondary"
                  >
                    Edit
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-secondary">No contacts yet.</p>
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
const organization = ref(null)
const contacts = ref([])

onMounted(async () => {
  const [orgData, contactsData] = await Promise.all([
    $fetch(`/api/organizations/${route.params.id}`),
    $fetch(`/api/contacts?organizationId=${route.params.id}`)
  ])

  organization.value = orgData
  contacts.value = contactsData.data
})

const handleDelete = async () => {
  if (confirm('Are you sure you want to delete this organization?')) {
    await $fetch(`/api/organizations/${route.params.id}`, {
      method: 'DELETE'
    })
    await navigateTo('/admin/organizations')
  }
}
</script>