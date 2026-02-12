import React from 'react'

export default async function docs({ params }) {
    const { slug } = await params;

    if (slug.length === 2) {
        //length 2 meaning the r2 routes like docs/routs/concept
        return <h1>viewing docs for {slug[0]} concept {slug[1]}</h1>
        //so it prints viewing docs for routed concept concept 
    }
    else if (slug.length === 1) {

        return <h1>viewing docs for {slug[0]}</h1>
    }
    else {

        return <h1>docs home page</h1>

    }

}
