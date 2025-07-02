<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Info</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding info-content">
      <!-- Info Card (always visible) -->
      <ion-card class="info-card info-accent-card">
        <ion-card-header>
          <ion-card-title>Welcome to the Conference Info Page</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="welcome-img-wrapper">
            <ion-img src="/data/image.jpg" alt="Conference" style="max-width: 100%; max-height: 180px; object-fit: cover; border-radius: 12px;"></ion-img>
          </div>
          <p class="welcome-text">
            Please log in with your Paper ID and password to view your presentation details, session location, and more. If you do not have your credentials, contact the conference organizer.
          </p>
        </ion-card-content>
      </ion-card>

      <!-- Login Card -->
      <ion-card v-if="!loggedInPaper" class="info-card login-card">
        <ion-card-header>
          <ion-card-title>Login with Paper ID</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="onLogin">
            <ion-item>
              <ion-label position="stacked">Paper ID</ion-label>
              <ion-input v-model="loginPaperId" type="text" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Password</ion-label>
              <ion-input v-model="loginPassword" type="password" required></ion-input>
            </ion-item>
            <ion-button expand="block" type="submit" class="login-btn">Login</ion-button>
          </form>
          <ion-alert
            :is-open="loginError"
            header="Login Failed"
            message="Incorrect Paper ID or Password."
            :buttons="[{ text: 'OK', handler: () => { loginError = false } }]"
            @didDismiss="loginError = false"
          />
        </ion-card-content>
      </ion-card>

      <!-- Paper Info Card -->
      <ion-card v-else class="info-card paper-info-card">
        <ion-card-header>
          <ion-card-title>Paper Information</ion-card-title>
          <ion-card-subtitle class="ion-text-center" style="margin-top: 0.5em;">{{ loggedInPaper.title }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item>
              <ion-label><strong>Paper ID</strong></ion-label>
              <ion-label class="ion-text-end">{{ loggedInPaper.paperId }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label><strong>Speaker</strong></ion-label>
              <ion-label class="ion-text-end">{{ loggedInPaper.speaker }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label><strong>Email</strong></ion-label>
              <ion-label class="ion-text-end">{{ loggedInPaper.mail }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label><strong>Presentation Time</strong></ion-label>
              <ion-label class="ion-text-end">{{ loggedInPaper.presentationTime }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label><strong>Session Place</strong></ion-label>
              <ion-label class="ion-text-end">{{ loggedInPaper.sessionPlace }}</ion-label>
            </ion-item>
            <ion-item>
              <ion-label><strong>Status</strong></ion-label>
              <ion-badge slot="end" :color="loggedInPaper.status === 'oral' ? 'success' : 'warning'">
                {{ loggedInPaper.status === 'oral' ? 'Oral' : 'Poster' }}
              </ion-badge>
            </ion-item>
            <ion-item>
              <ion-label><strong>Attendance Confirmation</strong></ion-label>
              <ion-toggle
                slot="end"
                color="success"
                :checked="!!store.state.password.attendance?.[loggedInPaper.paperId]"
                @ionChange="toggleAttendance"
              >
              </ion-toggle>
            </ion-item>
            <ion-item>
              <ion-label><strong>Paper Download</strong></ion-label>
              <ion-button
                slot="end"
                color="primary"
                :disabled="!!store.state.password.downloads?.[loggedInPaper.paperId]"
                @click="downloadPaper"
              >
                <template v-if="store.state.password.downloads?.[loggedInPaper.paperId]">Downloaded</template>
                <template v-else>Download</template>
              </ion-button>
            </ion-item>
            <ion-item>
              <ion-label><strong>Login Count</strong></ion-label>
              <ion-badge slot="end" color="primary">{{ store.state.password.loginCount?.[loggedInPaper.paperId] || 0 }}</ion-badge>
            </ion-item>
            <ion-item>
              <ion-label><strong>Logout Count</strong></ion-label>
              <ion-badge slot="end" color="medium">{{ store.state.password.logoutCount?.[loggedInPaper.paperId] || 0 }}</ion-badge>
              <ion-buttons slot="end">
                <ion-button color="danger" size="small" @click="onLogout" class="logout-btn">Logout</ion-button>
              </ion-buttons>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.info-content {
  display: block;
  background: #f6f8fa;
}
.info-card {
  max-width: 420px;
  width: 100%;
  margin-top: 5em;
  margin-bottom: 1.5em;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  border: 1px solid #e0e4ea;
  background: #fff;
}
.info-accent-card {
  background: linear-gradient(90deg, #e3f0ff 0%, #f8fbff 100%);
  border: 1px solid #b6d4fa;
}
.login-card {
  border-left: 4px solid #3880ff;
}
.paper-info-card {
  border-left: 4px solid #10dc60;
}
.login-btn {
  margin-top: 1.2em;
}
.logout-btn {
  margin-top: 1.5em;
  max-width: 420px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.1em;
  font-weight: 500;
}
.logout-btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 2em;
}
.welcome-img-wrapper {
  width: 100%;
  margin-bottom: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.welcome-text {
  margin-top: 2em;
  margin-bottom: 0;
  font-size: 1.08em;
  line-height: 1.6;
}
@media (max-width: 600px) {
  .info-card {
    max-width: 98vw;
    margin-top: 1em;
    margin-bottom: 1em;
  }
}
</style>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonBadge, IonAlert, IonList, IonButtons, IonToggle } from '@ionic/vue'
import { ref } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const loginPaperId = ref('')
const loginPassword = ref('')
const loginError = ref(false)
const loggedInPaper = ref(null)

function onLogin()
{
  loginError.value = false
  const found = store.state.password.papers.find(
    p => p.paperId === loginPaperId.value && p.password === loginPassword.value
  )
  if (found) {
    loggedInPaper.value = found
    store.dispatch('incrementLoginCount', found.paperId)
    store.dispatch('clearDownload', found.paperId)
  } else {
    loginError.value = true
  }
}

function onLogout() 
{
  if (loggedInPaper.value) {
    store.dispatch('incrementLogoutCount', loggedInPaper.value.paperId)
  }
  loggedInPaper.value = null
  loginPaperId.value = ''
  loginPassword.value = ''
  router.push('/tabs/info')
}

function toggleAttendance() {
  store.dispatch('toggleAttendance', loggedInPaper.value.paperId)
}

function downloadPaper() {
  // Simulate download and mark as downloaded
  store.dispatch('markDownloaded', loggedInPaper.value.paperId)
  // In a real app, trigger file download here
}
</script> 