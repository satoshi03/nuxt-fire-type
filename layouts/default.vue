<template>
  <v-app>
    <v-toolbar
      color="#24292e"
      fixed
      app
    >
      <v-toolbar-title class="toolbar-title" v-text="title"/>
      <v-spacer></v-spacer>
      <v-btn
        @click="fetchRanking()"
        dark
      >
        <span class="btn-label">ランキング</span>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-dialog v-model="dialog" max-width=600 scrollable>
      <v-card >
        <v-card-title>
          <span class="headline">スコアランキング</span>
        </v-card-title>
        <v-list class="dialog-list" v-for="(item, index) in sortRanking()" :key="index" three-line>
          <v-divider></v-divider>
          <v-list-tile >
            <v-list-tile-content>
              <v-list-tile-sub-title>{{ index + 1 }}位</v-list-tile-sub-title>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              <v-list-tile-title>{{ item.score }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; CODE TYPE 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import firebase from '~/plugins/firebase'

export default {
  data() {
    return {
      dialog: false,
      fixed: false,
      title: 'CODE TYPE'
    }
  },
  computed: {
    ...mapState(['ranking']),
  },
  methods: {
    ...mapActions(['setRanking']),
    fetchRanking () {
      const database = firebase.database()
      const ref = database.ref('ranking')
      ref.orderByChild('sortKey').limitToLast(20).once('value', snapshot => {
        const ss = snapshot.val()
        this.setRanking(ss)
      })
      this.dialog = true
    },
    sortRanking () {
      var ranking = []
      for (let key in this.ranking) {
        ranking.push(this.ranking[key])
      }
      ranking.sort(function(a, b){
        if (a.score < b.score) return 1;
        if (a.score > b.score) return -1;
        return 0;
      });
      return ranking
    }
  }
}
</script>

<style>
.toolbar-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.btn-label {
  font-weight: bold;
}
</style>
