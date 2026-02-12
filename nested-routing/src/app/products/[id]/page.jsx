export default async function ProductDetails({ params }) {
    const { id } = await params;

    return (
        <div>
            <h1>Details of the product {id}</h1>
        </div>
    );
}
//params is a Promise and must be unwrapped with await and [] brackets is used to wraap the dynamic routes withe id 
