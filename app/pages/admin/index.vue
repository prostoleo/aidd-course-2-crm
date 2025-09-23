<template>
  <AdminLayout>
    <h1>Dashboard</h1>
    <div class="grid grid-cols-4 mb-4">
      <div class="card">
        <div class="card-body">
          <h3>{{ stats.organizations }}</h3>
          <p class="text-secondary">Organizations</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h3>{{ stats.contacts }}</h3>
          <p class="text-secondary">Contacts</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h3>{{ stats.opportunities }}</h3>
          <p class="text-secondary">Opportunities</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h3>${{ stats.totalValue.toLocaleString() }}</h3>
          <p class="text-secondary">Pipeline Value</p>
        </div>
      </div>
    </div>

    <h2>Recent Organizations</h2>
    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="org in recentOrgs" :key="org.id">
              <td>
                <NuxtLink :to="`/admin/organizations/${org.id}`">
                  {{ org.name }}
                </NuxtLink>
              </td>
              <td>{{ org.industry || '-' }}</td>
              <td>{{ org.city || '-' }}</td>
              <td>
                <NuxtLink
                  :to="`/admin/organizations/${org.id}`"
                  class="btn btn-sm btn-secondary"
                >
                  View
                </NuxtLink>
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

const stats = ref({
  organizations: 0,
  contacts: 0,
  opportunities: 0,
  totalValue: 0
})

const recentOrgs = ref([])

onMounted(async () => {
  const [orgsData, contactsData] = await Promise.all([
    $fetch('/api/organizations?limit=5'),
    $fetch('/api/contacts?limit=100')
  ])

  recentOrgs.value = orgsData.data
  stats.value.organizations = orgsData.data.length
  stats.value.contacts = contactsData.data.length
  stats.value.opportunities = 5
  stats.value.totalValue = 1075000
})
</script>