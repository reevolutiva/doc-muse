from conf.KimfeRag import KimfeRag

kimfe_rag = KimfeRag( "kimfe" )

kimfe_rag.load_documents( "/app/data" )

kimfe_rag.load_storage()

response = kimfe_rag.query( "¿Quien Paul Graham" )

print( response )