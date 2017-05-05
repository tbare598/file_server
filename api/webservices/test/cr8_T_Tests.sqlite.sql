CREATE TABLE T_ATSK_Tests
      ( Test_ID  INTEGER PRIMARY KEY,
        Test_Type TEXT,
        Test TEXT,
        Submitter TEXT,
        Ticket_ID TEXT,
        Expected_Results TEXT);

CREATE TABLE T_ATSK_Test_LK_Files
      ( Test_ID INTEGER,
        File_Path TEXT,
        CONSTRAINT T_Test_LK_Files_PK PRIMARY KEY (Test_ID, File_Path)
        );

CREATE TABLE T_ATSK_Test_Cycles
      ( Test_Cycle_ID INTEGER PRIMARY KEY autoincrement,
        Environment TEXT,
        Branch TEXT,
        Latest_Revision TEXT,
        Execution_Time TEXT
        );
        
CREATE TABLE T_ATSK_Test_Results
      ( Test_ID INTEGER,
        Test_Cycle_ID INTEGER,
        Results TEXT,
        Results_Status TEXT,
        CONSTRAINT T_Test_Results_PK PRIMARY KEY (Test_ID, Test_Cycle_ID)
        );