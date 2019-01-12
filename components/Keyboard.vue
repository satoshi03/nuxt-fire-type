<template>
  <div class="keyboard">
    <div
      v-for="(rowkeys, index) in keys"
      class="row"
      >
      <div
        v-for="item in keys[index]"
        :class="getKeyClass(item)"
        >
        {{ item.repl }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keys : [
        [
          { 'repl': '1', 'def': '1', 'cap': '!' },
          { 'repl': '2', 'def': '2', 'cap': '"' },
          { 'repl': '3', 'def': '3', 'cap': '#' },
          { 'repl': '4', 'def': '4', 'cap': '$' },
          { 'repl': '5', 'def': '5', 'cap': '%' },
          { 'repl': '6', 'def': '6', 'cap': '&' },
          { 'repl': '7', 'def': '7', 'cap': '\'' },
          { 'repl': '8', 'def': '8', 'cap': '(' },
          { 'repl': '9', 'def': '9', 'cap': ')' },
          { 'repl': '0', 'def': '0', 'cap': '0' },
          { 'repl': '-', 'def': '-', 'cap': '=' },
          { 'repl': '^', 'def': '^', 'cap': '~' },
          { 'repl': '\\', 'def': '\\', 'cap': '|' },
          { 'repl': 'DEL', 'def': '[DEL]', 'cap': '[DEL]', 'class': 'key' },
        ],
        [
          { 'repl': 'Q', 'def': 'q', 'cap': 'Q' },
          { 'repl': 'W', 'def': 'w', 'cap': 'W' },
          { 'repl': 'E', 'def': 'e', 'cap': 'E' },
          { 'repl': 'R', 'def': 'r', 'cap': 'R' },
          { 'repl': 'T', 'def': 't', 'cap': 'T' },
          { 'repl': 'Y', 'def': 'y', 'cap': 'Y' },
          { 'repl': 'U', 'def': 'u', 'cap': 'U' },
          { 'repl': 'I', 'def': 'i', 'cap': 'I' },
          { 'repl': 'O', 'def': 'o', 'cap': 'O' },
          { 'repl': 'P', 'def': 'p', 'cap': 'P' },
          { 'repl': '@', 'def': '@', 'cap': '`' },
          { 'repl': '[', 'def': '[', 'cap': '{' },
          { 'repl': 'Enter', 'def': '\n', 'cap': '\n', 'class': 'key--wide'},
        ],
        [
          { 'repl': 'A', 'def': 'a', 'cap': 'A' },
          { 'repl': 'S', 'def': 's', 'cap': 'S' },
          { 'repl': 'D', 'def': 'd', 'cap': 'D' },
          { 'repl': 'F', 'def': 'f', 'cap': 'F' },
          { 'repl': 'G', 'def': 'g', 'cap': 'G' },
          { 'repl': 'H', 'def': 'h', 'cap': 'H' },
          { 'repl': 'J', 'def': 'j', 'cap': 'J' },
          { 'repl': 'K', 'def': 'k', 'cap': 'K' },
          { 'repl': 'L', 'def': 'l', 'cap': 'L' },
          { 'repl': ';', 'def': ';', 'cap': '+' },
          { 'repl': ':', 'def': ':', 'cap': '*' },
          { 'repl': ']', 'def': ']', 'cap': '}' },
        ],
        [
          { 'repl': 'Shift', 'def': '[SHIFT]', 'cap': '[SHIFT]', 'class': 'key--wide'},
          { 'repl': 'Z', 'def': 'z', 'cap': 'Z' },
          { 'repl': 'X', 'def': 'x', 'cap': 'X' },
          { 'repl': 'C', 'def': 'c', 'cap': 'C' },
          { 'repl': 'V', 'def': 'v', 'cap': 'V' },
          { 'repl': 'B', 'def': 'b', 'cap': 'B' },
          { 'repl': 'N', 'def': 'n', 'cap': 'N' },
          { 'repl': 'M', 'def': 'm', 'cap': 'M' },
          { 'repl': ',', 'def': ',', 'cap': '<' },
          { 'repl': '.', 'def': '.', 'cap': '>' },
          { 'repl': '/', 'def': '/', 'cap': '?' },
          { 'repl': '_', 'def': '_', 'cap': '_' },
          { 'repl': 'Shift', 'def': '[SHIFT]', 'cap': '[SHIFT]', 'class': 'key--wide'},
        ],
        [
          { 'repl': '', 'def': ' ', 'cap': ' ', 'class': 'key--space'},
        ],
      ],
    }
  },
  props: ['nextKey', 'wrongKey'],
  methods: {
    getKeyClass(item) {
      var classes = []
      if (item.class) {
        classes.push(item.class)
      } else {
        classes.push("key")
      }
      const lastStr = this.getNextKey()
      if (item.def == lastStr || item.cap == lastStr) {
        classes.push("key--push")
      }
      const wrongKey = this.getWrongKey()
      if (wrongKey !== "" && (item.def == wrongKey || item.cap == wrongKey)) {
        classes.push("key--wrong")
      }
      return classes
    },
    getNextKey() {
      return this.nextKey
    },
    getWrongKey() {
      return this.wrongKey
    },
  }
}
</script>

<style>
.keyboard {
  display:flex;
  flex-direction:column;
  align-items:center; /* Y-axes in this case */
}

.row {
  display:flex;
  align-content:space-around;
}

.key {
  padding:10px;
  height:50px;
  width:50px;
  border: 1px solid #24292e;
  border-right: 2px solid #24292e;
  border-bottom: 2px solid #24292e;
  border-radius: 4px;
  margin: 2px;
}

.key--wide {
  padding:10px;
  height:50px;
  width:80px;
  border: 1px solid black;
  border-right: 2px solid black;
  border-bottom: 2px solid black;
  border-radius: 4px;
  margin: 2px;
}

.key--push {
  border: 1px solid black;
  background-color: #64B5F6;
}

.key--wrong {
  border: 1px solid black;
  background-color: #E53935;
}

.key--space {
  padding:10px;
  height:50px;
  width:400px;
  border: 1px solid black;
  border-right: 2px solid black;
  border-bottom: 2px solid black;
  border-radius: 4px;
  margin: 2px;
}
</style>
