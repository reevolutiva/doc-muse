const APIBASE = 'https://trainerbot.me/wp-json/trainerbot/v2'

const generateDocument = async ( app: string, botID: string, blocks: Array, title: string, description:string ) => {

    const URL = `${APIBASE}/app/${app}/bot/${botID}/kimfe/doc-write`;

    const body = {
        title: title ?? '' ,
        description: description ?? '',
        blocks: blocks
    }

    const args ={
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Supabase (https://supabase.io)',
        },
        body: JSON.stringify(body),
    }

    
    const response = await fetch(URL, args )

    const data = await response.json()

    return data
}

const trainerbotClient = {
    generateDocument: generateDocument
};

export { trainerbotClient }