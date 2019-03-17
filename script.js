Vue.filter('date', time => moment(time).format('YYYY.MM.DD, HH:mm')) 
new Vue({
    el: '#notebook',
    data () {
        return {
			notes: JSON.parse(localStorage.getItem('notes')) || [],
			selectedId: localStorage.getItem('selected-id') || null,
        }
    },
    computed: {
        notePreview () {
			return this.selectedNote ? marked(this.selectedNote.content) : ''
		},
		addButtonTitle () {
			return this.notes.length + ' note(s) already'
		},
		selectedNote () {
			return this.notes.find(note => note.id === this.selectedId)
		},
		sortedNotes () {
			return this.notes.slice()
			.sort((a, b) => a.created - b.created)
			.sort((a, b) => a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1)
		},
		linesCount () {
			if (this.selectedNote) {
				return this.selectedNote.content.split(/\r\n|\r|\n/).length				
			}
		},
		wordsCount () {
			if (this.selectedNote) {
				var s = this.selectedNote.content	
				s = s.replace(/\n/g, ' ')
				s= s.replace(/(^\s*)|(\s*$)/gi, '')
				s= s.replace(/\s\s+/gi, ' ')
				return s.split(' ').length
			}
		},
		charactersCount () {
			if (this.selectedNote) {
				return this.selectedNote.content.split('').length				
			}
		},
	},
	watch: {
		notes: {
			handler: 'saveNote',
			deep: true,
		},
		selectedId (val) {
			localStorage.setItem('selected-id', val)
		}
	},
	methods: {
		saveNote() {
			localStorage.setItem('notes', JSON.stringify(this.notes))	
		},
		addNote() {
			const time = Date.now()
			const note = {
				id: String(time),
				title: 'New note ' + (this.notes.length + 1),
				content: 'write note here with **markdown**',
				created: time,
				favorite: false,
			}
			this.notes.push(note)
		},
		selectNote (note) {
			this.selectedId = note.id
		},
		removeNote () {
			const note = this.selectedNote
			if (note && confirm('Delete the note?')) {
				const index = this.notes.indexOf(note)	
				if (index !== -1) {
					this.notes.splice(index, 1)	
				}
			}
		},
		favoriteNote () {
			this.selectedNote.favorite ^= true
		},
	},
})