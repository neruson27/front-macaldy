import gql from "graphql-tag";

/* 
AllOrders: [Orders]
OneOrder(id: ID): Orders
CreateOrder(data: OrdersInput): Orders
UpdateOrdersStatus(id: ID, status: String): Orders
DeleteOrder(id: ID): Response 
*/

export const ALL_ORDER_QUERY = gql`
  query AllOrders {
    AllOrders {
      _id
      ref_payco
      orderNumber
      products {
        _id
        name
        description
        price
        highlight
        image
        audio
        branch {
          name
        }
        model
        category {
          name
        }
        subcategory {
          name
        }
        tags {
          name
        }
        ref
        ctd
        quantity
        important
        createdAt
      }
      price
      status
      createdAt
    }
  }
`;

export const ONE_ORDER_QUERY = gql`
  query OneOrder($id: ID!) {
    OneOrder(id: $id) {
      _id
      ref_payco
      orderNumber
      products {
        _id
        name
        description
        price
        image
        audio
        branch {
          name
        }
        model
        category {
          name
        }
        subcategory {
          name
        }
        tags {
          name
        }
        ref
        ctd
        important
        createdAt
      }
      price
      status
      createdAt
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($data: OrdersInput!) {
    CreateOrder(data: $data) {
      _id
      ref_payco
      orderNumber
      products {
        _id
        name
        description
        price
        image
        audio
        branch {
          name
        }
        model
        category {
          name
        }
        subcategory {
          name
        }
        tags {
          name
        }
        ref
        ctd
        important
        createdAt
      }
      price
      status
      createdAt
    }
  }
`;

export const ORDER_STATUS_UPDATE = gql`
  mutation UpdateOrdersStatus($id: ID!, $status: String) {
    UpdateOrdersStatus(id: $id, status: $status) {
      _id
      ref_payco
      orderNumber
      products {
        _id
        name
        description
        price
        image
        audio
        branch {
          name
        }
        model
        category {
          name
        }
        subcategory {
          name
        }
        tags {
          name
        }
        ref
        ctd
        important
        createdAt
      }
      price
      status
      createdAt
    }
  }
`;

export const ORDER_DELETE = gql`
  mutation DeleteOrder($branchId: ID!) {
    DeleteOrder(id: $branchId) {
      status
    }
  }
`;