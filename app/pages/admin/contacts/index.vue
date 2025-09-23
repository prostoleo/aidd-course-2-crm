<template>
  <AdminLayout>
    <div class="flex flex-between mb-3">
      <h1>Contacts</h1>
      <NuxtLink to="/admin/contacts/new" class="btn btn-primary">
        Add Contact
      </NuxtLink>
    </div>

    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Organization</th>
              <th>Position</th>
              <th>Email</th>
              <th>Phone</th>
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
              <td>
                <NuxtLink
                  v-if="contact.organization"
                  :to="`/admin/organizations/${contact.organization.id}`"
                >
                  {{ contact.organization.name }}
                </NuxtLink>
              </td>
              <td>{{ contact.position || '-' }}</td>
              <td>{{ contact.email || '-' }}</td>
              <td>{{ contact.phone || '-' }}</td>
              <td>
                <div class="btn-group">
                  <NuxtLink
                    :to="`/admin/contacts/${contact.id}`"
                    class="btn btn-sm btn-secondary"
                  >
                    View
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/contacts/${contact.id}/edit?return=/admin/contacts`"
                    class="btn btn-sm btn-secondary"
                  >
                    Edit
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const contacts = ref([])

onMounted(async () => {
  const data = await $fetch('/api/contacts')
  contacts.value = data.data
})
</script>