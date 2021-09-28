import gql from 'graphql-tag'

 export const TICKET_QUERY = gql`
 query tickets($form: Date, $to: Date) {
  tickets(date_Gte: $form, date_Lte: $to) {
    edges {
      node {
        id
        subject
        description
        priority {
          id
          priority
        }
        service {
          id
          service
        }
        assignTo {
          id
          team
        }
        status {
          id
          status
        }
        createdBy {
          id
          username
          firstName
        }
        createdAt
      }
    }
  }
}
`

export const TICKET_PRIORITY = gql`
query{ 
  ticketPriority{ 
    id priority 
  } 
}
`

export const GET_TICKET_DETAILS = gql`
query($id: ID!) {
  ticket(id: $id) {
    subject
    description
    priority{
      id
      priority
    }
    service{
      id
      service
    }
    assignTo{
      id
      team
    }
    status{
      id
      status
    }
  }
}
`