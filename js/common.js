let cardComponent = {
    template: `<div class="card">
    <h2><span v-show="isShow">{{card.cardStatus}}</span>{{card.cardName}}</h2>
    <span class="status">{{card.cardStatus}}</span>
    <ul>
    <li>[ start ] {{card.cardStartTime}}</li>
    <li>[ finish ] {{card.cardFinishTime}}</li>
    <li>[ costs ] {{card.costs}}分</li>
    </ul>
    <button @click.prevent="cardComDel(card.key)">削除</button>
    </div><!-- /.card -->`,
    props:{
        card:{
            type:Object
        }
    },
    data(){
        return{
            isShow:false
        }
    },
    methods:{
        cardComDel(key){
            this.$emit('costom-event', key)
        }
    }
}

let tools = new Vue({
    el:'#tools',
    components:{
        cardComponent
    },
    data(){
        return{
            cardNameSet:'',
            cardStartTime:'',
            cardStartTimeMs:'',
            cardFinishTime:'',
            cardFinishTimeMs:'',
            cardStatus:'',
            costs:'',
            newCards:[],
            query:'',
            next: 0
        }
    },
    methods:{

        timeSet(){
            let nowDate = new Date();
            let hours = nowDate.getHours();
            let minutes = nowDate.getMinutes();
            let setTime = hours +':'+ minutes;
            let setTimeMs = nowDate.getTime();
            return [setTime,setTimeMs]
        },

        cardNameStart(e){
            this.cardNameSet = e.target.value

            let setTimeFn = this.timeSet();
            this.cardStartTime = setTimeFn[0]
            this.cardStartTimeMs = setTimeFn[1]
        },

        createCard(){
            if(!this.cardNameSet || !this.cardStatus) return

            let setTimeFn = this.timeSet();
            this.cardFinishTime = setTimeFn[0]
            this.cardFinishTimeMs = setTimeFn[1]

            let costs = this.cardFinishTimeMs - this.cardStartTimeMs
            this.costs = Math.floor(costs/1000/60)%60;

            const newCard = {
                cardName: this.cardNameSet,
                cardStartTime: this.cardStartTime,
                cardFinishTime: this.cardFinishTime,
                costs: this.costs,
                cardStatus: this.cardStatus,
                key:this.next
            }

            this.newCards.unshift(newCard)
            this.cardNameSet = ''
            this.cardStartTime = ''
            this.cardFinishTime = ''
            this.cardStatus = ''
            this.next ++
        },

        deleteCard(key){
            let that = this
            that.newCards.some(function(card, i){
                if(card.key == key) that.newCards.splice(i, 1)
            })
        }

    },
    computed:{
        filteredList(){
            let that = this
            return this.newCards.filter( card => {
                return card.cardName.indexOf(that.query) !== -1
            })
        }
    }
})