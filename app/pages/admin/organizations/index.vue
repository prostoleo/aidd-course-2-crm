<template>
  <AdminLayout>
    <div class="flex flex-between mb-3">
      <h1>Organizations</h1>
      <NuxtLink to="/admin/organizations/new" class="btn btn-primary">
        Add Organization
      </NuxtLink>
    </div>

    <div class="card">
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th>Website</th>
              <th>City</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="org in organizations" :key="org.id">
              <td>
                <NuxtLink :to="`/admin/organizations/${org.id}`">
                  {{ org.name }}
                </NuxtLink>
              </td>
              <td>{{ org.industry || '-' }}</td>
              <td>
                <a v-if="org.website" :href="org.website" target="_blank">
                  {{ org.website }}
                </a>
                <span v-else>-</span>
              </td>
              <td>{{ org.city || '-' }}</td>
              <td>{{ org.state || '-' }}</td>
              <td>
                <div class="btn-group">
                  <NuxtLink
                    :to="`/admin/organizations/${org.id}`"
                    class="btn btn-sm btn-secondary"
                  >
                    View
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/organizations/${org.id}/edit?return=/admin/organizations`"
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

const organizations = ref([])

onMounted(async () => {
  const data = await $fetch('/api/organizations')
  organizations.value = data.data
})
</script>