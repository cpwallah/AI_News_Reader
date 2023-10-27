// Use this sample to create your own voice commands
// play('Welcome to the Alan AI News Reader App by Rehan Khalil')
intent('hello', p => {
    p.play('(I AM SHIVANSH. A PROFESSIONAL AND ENTHUSIASTIC WEB DEVELOPER)');
});
// reply('Welcome to the Alan AI News Reader App by Rehan Khalil')

// intent('What does this app do?','what can i do here?',reply('This is a News App'));

// intent('Start a command', p=>{p.play({command:'testCommand'})})

const API_KEY='3a0d0258c01c448cba14027c283e362c';
let savedArticles=[];


intent('Give me the latest news', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;
        NEWS_API_URL = `${NEWS_API_URL}&language=en&sources=bbc-news`
    
    api.request(NEWS_API_URL, {headers: {"user-agent": 'user agent' }}, (error, response, body) => {
        console.log('body',body)

        const { articles } = JSON.parse(body);
        if(!articles?.length) {
            p.play('Sorry, please try searching for news from a different source');
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newsHeadlines', articles });
        p.play(`Here are the (latest|recent) news `);
  
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
})
// News by Source

intent('Give me the news from $(source* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;
    
    if(p.source.value) {
        NEWS_API_URL = `${NEWS_API_URL}&sources=${p.source.value.toLowerCase().split(" ").join('-')}`
    }
    
    api.request(NEWS_API_URL, {headers: {"user-agent": 'user agent' }}, (error, response, body) => {
        console.log('body',body)

        const { articles } = JSON.parse(body);
        if(!articles?.length) {
            p.play('Sorry, please try searching for news from a different source');
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newsHeadlines', articles });
        p.play(`Here are the (latest|recent) news from ${p.source.value}.`);
  
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
})

// News by Specific Search Terms

intent('What\'s up with $(term* (.*))',p=>{
    let NEWS_API_URL=`https://newsapi.org/v2/everything?apiKey=${API_KEY}`;
    console.log("p",p.term.value)
    if(p.term.value){
        NEWS_API_URL=`${NEWS_API_URL}&q=${p.term.value}`;
//         api.request()
        api.request(NEWS_API_URL,{headers: {"user-agent": 'user agent' }},(error,response,body)=>{
            console.log('body',body)
            
            const {articles}=JSON.parse(body);
            
            console.log('articles',articles)
            if(!articles?.length){
                p.play('Sorry! Please Try Searching for a Different Term'| 'Sorry! Please Try Searching for something else.');
                return;
            }
            savedArticles=articles;
            console.log("savedArticles",savedArticles)
            p.play({command:'newsHeadlines',articles});
            p.play(`Here are the (latest|recent) articles on  ${p.term.value}`);
             p.play('Would you like me to read the headlines?');
        p.then(confirmation);
            
        });
    }
})

// News by Categories
const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
const CATEGORIES_INTENT = `${CATEGORIES.map((category) => `${category}~${category}`).join('|')}`;

intent(`(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about|on|) $(C~ ${CATEGORIES_INTENT})`,
  `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~ ${CATEGORIES_INTENT}) $(N news|headlines)`, (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&country=us`;
    
    if(p.C.value) {
        NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&category=${p.C.value}`
    }
    
    api.request(NEWS_API_URL,{headers: {"user-agent": 'user agent' }}, (error, response, body) => {
        const { articles } = JSON.parse(body);
        
        if(!articles.length) {
            p.play('Sorry, please try searching for a different category.');
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newsHeadlines', articles });
        
        if(p.C.value) {
            p.play(`Here are the (latest|recent) articles on ${p.C.value}.`);        
        } else {
            p.play(`Here are the (latest|recent) news`);   
        }
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
});

const confirmation=context(()=>{
    intent('yes',async p=>{
        for(let i=0;i<savedArticles.length;i++){
            p.play({command:'highlight',article:savedArticles[i]});
                        p.play(`${savedArticles[i].title}`);

        }
    })
    intent('no',p=>{
                p.play('Sure, sounds good to me.')

    })
})

intent('open (the|) (article|) (number|) $(number* (.*))', (p) => {
    if(p.number.value) {
        p.play({ command:'open', number: p.number.value, articles: savedArticles})
    }
})

intent('(go|) back', (p) => {
    p.play('Sure, going back');
    p.play({ command: 'newsHeadlines', articles: []})
})
intent('give (me|) (the|) instructions ', (p) => {
   
        p.play({ command:'instructions'})
    
})

