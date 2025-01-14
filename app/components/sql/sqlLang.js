const sql={
    "root": {
      "name": "SQL Language",
      "value": 100,
      "details": [
        "Clauses",
        "Keywords",
        "Functions",
        "Joins",
        "Set Operations",
        "Subqueries",
        "Operators and Wildcards",
       
      ],
    //   "link": "https://www.w3schools.com/sql/"
    },
    "children": [
      {
        "name": "Clauses",
        "value": 95,
        "details": [
          "SELECT",
          "FROM",
          "WHERE",
          "GROUP BY",
          "HAVING",
          "ORDER BY",
          "LIMIT"
        ],
        "link": "#clauses"
      },
      {
        "name": "Keywords",
        "value": 90,
        "details": [
          "DISTINCT",
          "AS (aliasing)",
          "IN",
          "BETWEEN",
          "LIKE",
          "IS NULL / IS NOT NULL",
          "AND / OR / NOT",
          "ALL",
          "ANY / SOME",
          "EXISTS"
        ],
        "link": "#keywords"
      },
      {
        "name": "Functions",
        "value": 85,
        "details": ["Aggregate Functions", "Scalar Functions"],
         "link": "#functions",
        "children": [
          {
            "name": "Aggregate Functions",
            "value": 80,
            "details": [
              "COUNT()",
              "SUM()",
              "AVG()",
              "MAX()",
              "MIN()"
            ],
           
          },
          {
            "name": "Scalar Functions",
            "value": 75,
            "details": [
              "String functions (e.g., CONCAT, SUBSTRING, UPPER, LOWER)",
              "Date functions (e.g., DATEADD, DATEDIFF, YEAR, MONTH)",
              "Numeric functions (e.g., ROUND, ABS, CEILING, FLOOR)"
            ],
            // "link": "https://www.w3schools.com/sql/sql_ref_sqlserver.asp"
          }
        ]
      },
      {
        "name": "Joins",
        "value": 85,
        "details": [
          "INNER JOIN",
          "LEFT JOIN",
          "RIGHT JOIN",
          "FULL OUTER JOIN"
        ],
        "link": "#joins"
      },
      {
        "name": "Set Operations",
        "value": 80,
        "details": [
          "UNION [ALL]",
          "INTERSECT",
          "EXCEPT "
        ],
        "link": "#set_operations"
      },
      {
        "name": "Subqueries",
        "value": 75,
        "details": [
          "Correlated subqueries",
          "Non-correlated subqueries"
        ],
        "link": "#subqueries"
      },
      {
        "name": "Operators and Wildcards",
        "value": 70,
        "details": ["Comparison Operators", "Arithmetic Operators"],
        "link": "#operators_and_wildcards",
        "children": [
          {
            "name": "Comparison Operators",
            "value": 65,
            "details": [
              "= (equal to)",
              "<> (not equal to)",
              "< (less than)",
              "> (greater than)",
              "<= (less than or equal to)",
              ">= (greater than or equal to)"
            ],
            // "link": "https://www.w3schools.com/sql/sql_operators.asp"
          },
          {
            "name": "Arithmetic Operators",
            "value": 60,
            "details": [
              "+ (addition)",
              "- (subtraction)",
              "* (multiplication)",
              "/ (division)"
            ],
            // "link": "https://www.w3schools.com/sql/sql_operators.asp"
          }
    //       ,
    //         {
    //     "name": "Wildcards",
    //     "value": 55,
    //     "details": [
    //       "% (percent sign)",
    //       "_ (underscore)"
    //     ],
    //     "link": "https://www.w3schools.com/sql/sql_wildcards.asp"
    //   }
        ]}
    //   ,
    //   {
    //     "name": "Wildcards",
    //     "value": 55,
    //     "details": [
    //       "% (percent sign)",
    //       "_ (underscore)"
    //     ],
    //     "link": "https://www.w3schools.com/sql/sql_wildcards.asp"
    //   }
    ]
  }

  export default sql;