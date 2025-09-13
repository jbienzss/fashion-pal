# Fashion Pal Backend API

## Recommend Products Endpoint

### POST /api/recommend-products

Generates outfit recommendations based on personal information and event description.

**Required Fields:**

- `personalInfo.age` - User's age (number)
- `personalInfo.gender` - User's gender (string)
- `eventDescription` - Description of the event (string)

#### Request Body

```json
{
  "personalInfo": {
    "age": "number",
    "gender": "string"
  },
  "eventDescription": "string"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "Main Outfit": [
          {
            "title": "string",
            "price": "number",
            "description": "string",
            "imageUrl": "string",
            "productUrl": "string"
          }
        ]
      }
    ]
  },
  "message": "string"
}
```

#### Example Request

```bash
curl -X POST http://localhost:3001/api/recommend-products \
  -H "Content-Type: application/json" \
  -d @sample-request.json
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "Main Outfit": [
        {
          "title": "Elegant Event Dress",
          "price": 89.99,
          "description": "Perfect for friend's wedding in an outdoor garden, semi-formal dress code, looking for something elegant but not too formal. A stylish and comfortable choice.",
          "imageUrl": "https://example.com/images/dress1.jpg",
          "productUrl": "https://amazon.com/dp/dress1"
        }
        ],
        "Accessories": [
          {
            "title": "Classic Formal Shirt",
            "price": 45.50,
            "description": "High-quality formal shirt perfect for friend's wedding in an outdoor garden, semi-formal dress code, looking for something elegant but not too formal.",
            "imageUrl": "https://example.com/images/shirt1.jpg",
            "productUrl": "https://amazon.com/dp/shirt1"
          }
        ]
      }
    ]
  },
  "message": "Product recommendations generated successfully"
}
```
