const apiUrlContentRequests = 'https://657b4477394ca9e4af141487.mockapi.io/project/contentRequests';
const apiUrlOrders = 'https://657b4477394ca9e4af141487.mockapi.io/project/orders';

async function getContentRequests() {
    const response = await fetch(apiUrlContentRequests);
    const data = await response.json();

    const contentRequestsSection = document.getElementById('contentRequests');

    const titleElement = document.createElement('h2');
    titleElement.innerText = 'Yêu Cầu Nội Dung';
    titleElement.style.color = '#333';
    contentRequestsSection.appendChild(titleElement);

    const requestContainer = document.createElement('div');
    requestContainer.className = 'requestContainer';
    contentRequestsSection.appendChild(requestContainer);

    data.forEach(request => {
        const requestItem = document.createElement('div');
        requestItem.className = 'requestItem';
        requestItem.innerHTML = `
            <div class="card">
                <img src="${request.img}" alt="${request.img}" class="card-img-top request-image">
                <div class="card-body">
                    <h5 class="card-title request-title">${request.title}</h5>
                    <p class="card-text request-description">${request.description}</p>
                    <button class="btn btn-success" onclick="placeOrder('${request.id}')">Đặt Hàng</button>
                </div>
            </div>`;
        requestContainer.appendChild(requestItem);
    });

    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
    #contentRequests {
        text-align: center;
        margin-top: 20px;
        background-color: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
    }

    h2 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 30px;
    }

    .requestContainer {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .requestItem {
        flex: 0 0 calc(25% - 20px);
        margin: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease, border 0.3s ease;
        background-color: #fff;
        padding: 15px;
        border-radius: 8px;
    }

    .requestItem:hover {
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        border: 2px solid #28a745;
    }

    .card {
        width: 100%;
        border: none;
        border-radius: 10px;
        overflow: hidden;
    }

    .request-image {
        width: 100%;
        height: auto;
        border-bottom: 1px solid #ddd;
    }

    .card-body {
        padding: 20px;
    }

    .request-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .request-description {
        margin-bottom: 15px;
    }

    .btn-success {
        background-color: #28a745;
        color: #fff;
        border: none;
        border-radius: 5px;
        padding: 8px 15px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .btn-success:hover {
        background-color: #1e7e34;
    }

    @media (max-width: 768px) {
        .requestItem {
            flex: 0 0 calc(50% - 20px);
        }
    }
    `;

    contentRequestsSection.appendChild(styleElement);
}

async function submitOrder() {
    const title = prompt('Nhập tiêu đề yêu cầu:');
    const description = prompt('Nhập mô tả yêu cầu:');

    if (title && description) {
        await fetch(apiUrlContentRequests, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        });

        getContentRequests();
    }
}

async function placeOrder(requestId) {
    const quantity = prompt('Nhập số lượng:');
    if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
        await fetch(apiUrlOrders, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ requestId, quantity }),
        });

        getContentRequests();
        displayOrders();
    } else {
        alert('Số lượng không hợp lệ.');
    }
}

async function displayOrders() {
    const response = await fetch(apiUrlOrders);
    const orders = await response.json();

    const orderListSection = document.getElementById('orderList');
    orderListSection.innerHTML = '<h2>Đơn Đặt Hàng</h2>';

    orders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');
        orderItem.innerHTML = `
            <div class="order-details">
                <h3>Đơn Đặt Hàng #${order.id}</h3>
                <p class="order-info">Đơn hàng cho Yêu cầu ${order.requestId}</p>
                <p class="order-info">Số lượng: ${order.quantity}</p>
            </div>
        `;
        orderItem.style.backgroundColor = '#e2e3e5';
        orderItem.style.padding = '15px';
        orderItem.style.borderRadius = '8px';
        orderItem.style.marginBottom = '20px';

        orderListSection.appendChild(orderItem);
    });
}

getContentRequests();
displayOrders();
