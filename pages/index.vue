<template>
 <v-container>
  <div class="question-panel">
    <span>
      {{ updateMessage() }}
    </span>
  </div>
  <div class="input-panel">
    <input @keyup.escape="reset()" @keyup.space="beforeStart()" v-model="answer"></input>
  </div>
  <keyboard :wrongKey="wrongKey" :nextKey="nextKey"></keyboard>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <v-card>
      <v-card-title>
        <span class="headline">タイピング成績</span>
      </v-card-title>
      <v-list class="dialog-list" two-line>
        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-sub-title>タイピング速度</v-list-tile-sub-title>
            <v-list-tile-title>{{ speed }}wpm</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-sub-title>間違えた回数</v-list-tile-sub-title>
            <v-list-tile-title>{{ wrongCount }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-sub-title>正答率</v-list-tile-sub-title>
            <v-list-tile-title>{{ correctParcent }}%</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-sub-title>間違えたキー</v-list-tile-sub-title>
            <v-list-tile-title>{{ getWrongKeyMessage() }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-sub-title>スコア</v-list-tile-sub-title>
            <v-list-tile-title>{{ score }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          flat="flat"
          @click="registerRanking()"
        >
          ランキングに登録する
        </v-btn>

        <v-btn
          color="blue darken-1"
          flat="flat"
          @click="notRegisterRanking()"
        >
          ランキングに登録しない
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="inputDialog"
    width="500"
  >
    <v-card>
      <v-card-title>
        <span class="headline">ユーザ名を入力してください</span>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="name"
          label="ユーザ名"
          @keyup.enter="register()"
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          flat="flat"
          @click="register()"
        >
          登録
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
 </v-container>
</template>

<script>
import Keyboard from '~/components/Keyboard.vue'
import firebase from '~/plugins/firebase'

import lodash from 'lodash'

export default {
  components: {
    Keyboard,
  },
  data () {
    const words = ["print('Hello world')", "print", "for", "if", "dict", "list", "class", "def", "except", "try", "error",
                   "int", "bool", "float", "str", "import", "from", "math", "set", "random"]
    const questionNum = 10
    return {
      dialog: false,
      inputDialog: false,
      allWords: words,
      words: lodash.shuffle(words),
      questionNum: questionNum,
      wrongKey: "",
      nextKey: "",
      statusDict: {
        "ready": "ready",
        "starting": "starting",
        "started": "started",
        "finished": "finished",
      },
      answeredNum: 0,
      status: "ready",
      timer: undefined,
      startCount: 3,
      wrongKeys: [],
      question: "",
      answer: "ここでスペースを押すと開始",
      lastKeyIsCorrect: true,
      lastCorrectKeyIndex: 0,
      wordCount: 0,
      time: 0,
      speed: 0,
      correctParcent: 0,
      wrongCount: 0,
      score: 0,
      name: "",
    }
  },
  methods: {
    updateMessage () {
      if (this.isStatus("ready")) {
        return "プログラムに関する単語を" + this.questionNum + "問出題"
      }

      if (this.isStatus("starting")) {
        return this.startCount
      }

      if (this.isStatus("started")) {

        // check answer is correct
        if (this.isCorrectAnwser()) {
          this.lastCorrectKeyIndex = this.answer.length
          this.lastKeyIsCorrect = true
        } else {
          if (this.lastKeyIsCorrect) {
            this.wrongKeys.push(this.answer.slice(-1)[0])
          }
          this.lastKeyIsCorrect = false
        }

        this.updateWrongKey()
        this.updateNextKey()

        if (this.isCompleteAnswer()) {
          this.answeredNum += 1
          this.wordCount += this.question.length
          this.question = this.words.pop()
          this.lastCorrectKeyIndex = 0
          this.answer = ""
        }

        if (this.isFinished()) {
          clearInterval(this.timer)
          this.updateResult()
          this.dialog = true
          this.updateStatus("finished")
        }
        return this.question
      }

      if (this.isStatus("finished")) {
        return "お疲れ様でした"
      }
    },
    updateResult () {
      this.speed = Number(this.wordCount / this.time * 60).toFixed(1)
      this.wrongCount = this.wrongKeys.length
      this.correctParcent = Number(this.wordCount / (this.wordCount + this.wrongCount) * 100).toFixed(1)
      this.score = Number(this.speed * this.correctParcent / 100 * 1.1).toFixed(0)
    },
    getWrongKeyMessage () {
      return this.wrongKeys.join(', ')
    },
    isCorrectAnwser() {
      return (this.answer == this.question.slice(0, this.answer.length))
    },
    updateWrongKey () {
      if (this.lastKeyIsCorrect) {
        this.wrongKey = ""
      } else {
        // set last wrong key
        this.wrongKey = this.wrongKeys.slice(-1)[0]
      }
    },
    updateNextKey () {
      if (this.isStatus("started")) {
        this.nextKey = this.question[this.lastCorrectKeyIndex]
      } else {
        this.nextKey = " "
      }
    },
    isFinished() {
      return this.answeredNum >= this.questionNum
    },
    isCompleteAnswer() {
      return this.answer == this.question
    },
    updateStatus (status) {
      if (status in this.statusDict) {
        this.status = status
      } else {
        console.warn("bad status")
      }
    },
    inStatus (statusArray) {
      for (let status of statusArray) {
        if (this.isStatus(status)) {
          return true
        }
      }
      return false
    },
    isStatus (status) {
      return this.status == status
    },
    beforeStart () {
      if (this.inStatus(["starting", "started"])) {
        return
      }

      if (this.isStatus("finished")) {
        this.reset()
      }

      this.answer = ""
      this.updateStatus("starting")
      const _this = this
      this.startCount = 3
      // Count down start.
      // When start count is 0, start question
      var timer = setInterval(function () {
        _this.startCount -= 1
        if (_this.startCount <= 0) {
          clearInterval(timer)
          _this.start()
        }
      }, 1000)
    },
    start () {
      this.updateStatus("started")
      const _this = this
      this.timer = setInterval(function () {
        _this.time += 0.1
      }, 100)
      this.question = this.words.pop()
      this.answer = ""
    },
    isFinished() {
      return this.answeredNum >= this.questionNum
    },
    isCompleteAnswer () {
      return this.answer == this.question
    },
    registerRanking () {
      this.dialog = false
      if (name == "") {
        this.inputDialog = true
      } else {
        this.register()
      }
    },
    register () {
      const database = firebase.database()
      const ref = database.ref('ranking')
      ref.push({
        name: this.name,
        sortKey: -this.score,
        score: this.score,
        correctParcent: this.correctParcent,
        wrongKeys: this.wrongKeys,
        speed: this.speed,
      })
      this.reset()
      this.inputDialog = false
    },
    notRegisterRanking () {
      this.reset()
      this.dialog = false
    },
    reset () {
      clearInterval(this.timer)
      this.question = ""
      this.answwer = "ここでスペースを押すと開始"
      this.words = lodash.shuffle(this.allWords)
      this.startCount = 3
      this.time = 0
      this.status = "ready"
      this.answeredNum = 0
      this.wordCount = 0
      this.lastKeyisCorrect = true
      this.lastCorrectKeyIndex = 0
      this.wrongKeys = []
    }
  }
}
</script>

<style>
* {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", Hiragino Kaku Gothic ProN, "ヒラギノ角ゴ ProN W3", Arial, "メイリオ", Meiryo, sans-serif;
}

.body {
}

.container {
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
}

.question-panel {
  display:flex;
  height: 120px;
  min-width: 800px;
  margin: 5px;
  margin-top: 10px;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  border: 3px solid #999999;
  border-radius: 10px;
}

.question-panel span {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", Hiragino Kaku Gothic ProN, "ヒラギノ角ゴ ProN W3", Arial, "メイリオ", Meiryo, sans-serif;
  font-size: 30px;
  color: #35495e;
}

.input-panel {
  display:flex;
  align-items:center;
  justify-content: center;
  height: 60px;
  min-width: 600px;
}

.input-panel input {
  width: 80%;
  height: 36px;
  font-size: 20px;
  border-radius: 4px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border: 3px solid #999999;
  color: #35495e;
  padding-left: 10px;
}

.dialog-list {
  padding: 0;
}
</style>
