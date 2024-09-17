const AddFromURL = () => {


    const urlParams = new URLSearchParams(window.location.search);

    // Get specific parameters
    const orderNumber = urlParams.get('number');  // '2'
    const customerName = urlParams.get('name');  // 'asc'

    // localStorage.setItem("number", JSON.stringify(updatedOrders));
    return(
        <div>add from url</div>
    );
};

export default AddFromURL;
