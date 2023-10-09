import { createRouter, createWebHistory } from 'vue-router'
import UploadView from '../views/UploadView.vue'
import AboutView from '../views/AboutView.vue'
import TransformView from '../views/TransformView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'upload',
      component: UploadView,
      meta: {
        title: 'Upload your Toolbox stuff here',
        hint: 'Select a Toolbox file on the right and then we will process it showing you all the markers to choose from ... '
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        title: 'About',
        hint: 'Who we are, what this is and how to reach us'
      }
    },
    {
      path: '/transform',
      name: 'transform',
      component: TransformView,
      meta: {
        title: 'Transformation',
        hint: 'Preview the transformation and align the fields found in your file'
      }
    }
  ]
})

export default router
