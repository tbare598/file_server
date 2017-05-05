export const INITIAL_QUERY_TEXT =
  "SELECT CASE WHEN Count(*) = 1 THEN 'PASS'\n"
+ "            ELSE 'FAIL'\n"
+ '       END AS Test\n'
+ '  FROM (--Put Your Test Into Here\n'
+ '       SELECT *\n'
+ '         FROM T_PR_Carrier\n'
+ "        WHERE Carrier_Code = 'MONY'\n"
+ '  )--No Semicolon\n';
