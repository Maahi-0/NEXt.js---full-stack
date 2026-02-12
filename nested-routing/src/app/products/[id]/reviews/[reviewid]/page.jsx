import React from 'react'

export default async function reviewspage({ params }) {

    const { id, reviewid } = await params;

    return (
        <h1>Review : {id} , {reviewid}</h1>

    );
}