<template>
  <AdminLayout>
    <h1>New Organization</h1>

    <div class="card">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-2">
            <div class="form-group">
              <label class="form-label" for="name">Name *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="website">Website</label>
              <input
                id="website"
                v-model="form.website"
                type="url"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="industry">Industry</label>
              <input
                id="industry"
                v-model="form.industry"
                type="text"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="phone">Phone</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="address">Address</label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="city">City</label>
              <input
                id="city"
                v-model="form.city"
                type="text"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="state">State</label>
              <input
                id="state"
                v-model="form.state"
                type="text"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="zip">ZIP Code</label>
              <input
                id="zip"
                v-model="form.zip"
                type="text"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="country">Country</label>
              <input
                id="country"
                v-model="form.country"
                type="text"
                class="form-input"
              />
            </div>
          </div>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div class="btn-group">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading"></span>
              <span v-else>Create Organization</span>
            </button>
            <NuxtLink to="/admin/organizations" class="btn btn-secondary">
              Cancel
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const loading = ref(false)
const error = ref('')

const form = ref({
  name: '',
  website: '',
  industry: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: ''
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/organizations', {
      method: 'POST',
      body: form.value
    })
    await navigateTo('/admin/organizations')
  } catch (e: any) {
    error.value = e.data?.statusMessage || 'Failed to create organization'
  } finally {
    loading.value = false
  }
}
</script>