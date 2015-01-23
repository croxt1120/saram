define({
    DIALOG:{
       TITLE:{
           PRIMARY:"Info",
           DEFAULT:"Info",
           WARNING:"Warning",
           INFO:"Info",
           ERROR:"Error",
           USER_ADD:"Registration User",
           USER_UPDATE:"Edit User"
       },
       BUTTON:{
           OK:"OK",
           CANCEL:"Cancel",
           ADD:"Add",
           SAVE:"Save",
           CLOSE:"Close",
           INIT_PASSWORD:"Initialize password"
       }
    },
    USER:{
        NAME:"Name",
        ID:"Id",
        DEPT:"Department",
        NAME_COMMUTE:"Commute Name",
        JOIN_COMPANY:"Join Date",
        LEAVE_COMPANY:"Leave Date",
        PRIVILEGE:"Privilege",
        ADMIN:"Admin",
        PASSWORD:"Password",
        NEW_PASSWORD:"New Password",
        RE_NEW_PASSWORD:"Re New Password"
    },
    GRID:{
        MSG:{
            NOT_SELECT_ROW:"Plese Select Row."
        }
    },
    PAGE:{
        TITLE:{
            USER_MANAGER:"User Manager"
        },
        SUB_TITLE:{
            USER_LIST:"User List"
        }
    },
    
    //CODE
    CODE:{
        PRIVILEGE_1:"ALL",
        PRIVILEGE_2:"TEAM",
        PRIVILEGE_3:"USER",
        ADMIN_0:"USER",
        ADMIN_1:"MANAGER",
        ALL:"ALL",
        LEAVE_USER:"Leave",
        WORKER:"Worker"
    },
    
    
    //MSG
    SUCCESS:{
        USER:{
            SAVE:"Success Save User.",
            REMOVE:"Success Remove User.",
            ADD:"Success Add User."
        },
        LOGIN:{
            SUCCESS_INIT_PASSWORD:"Success Initialize Password."
        }
    },
    WARNING:{
        LOGIN:{
            NOT_VALID_LOGIN_INFO:"Check your Login Info.",
            INIT_PASSWORD_PUT:"Init password.",
            DO_NOT_FOUND_USER:"Not valid account.",
            NOT_EQULES_PASSWORD:"Not valid account.",
            INIT_PASSWORD:"Initialize password."
        },
        USER:{
            NOT_EQULES_CONFIG_PASSWORD:"Not valid new password."
        }
    },
    ERROR:{
        AUTH:{
            EXPIRE_AUTH:"Session has expired."
        },
        HTTP:{
            NOT_FIND_PAGE:"Not find page."
        },
        USER_EDIT_VIEW:{
            FAIL_RENDER:"Fail Load User Data.",
        }
    },
    CONFIRM:{
        USER:{
            REMOVE:"Do you want remove User?"
        }
    },
    
    //MENU
    MENU:{
        TOP:{
            SM:"Security Manager",
            AM:"Attendance Manager"
        },
        SUB:{
            SM:{
                USER:"User Manager",
                HOLIDAY:"Holiday Manager",
                VACATION:"Vacation Manager"
            },
            AM:{
                ADD_RAW_DATA:"Add Raw Data",
                RAW_DATA_LIST:"Raw Data List",
                CREATE_DATA:"Create Commute Data",
                COMMUTE_MANAGER:"Commute Data Manager",
                COMMUTE_MANAGER_COMMENT:"Commute History Manager",
                REPORT_MANAGER:"Commute Report"
            }
        }
    },
    
    //단위
    UNIT:{
        WON:"Won",
        DAY:"Day",
        MONTH:"Month",
        YEAR:"Year",
        HOURE:"Houre",
        MIN:"Min",
        SEC:"Sec"
    },
    
    DASHBOARD:{
        WORKING_SUMMARY:{
            ID:"Id",
            NAME:"Name",
            TOTAL_OVERTIEM_PAY:"Total over time pay",
            TOTAL_WORKING_DAY:"Total working day",
            VACATION:"Vaction",
            NIGHT_WORKING_A:"Night WORKTYPE A",
            NIGHT_WORKING_B:"Night WORKTYPE B",
            NIGHT_WORKING_C:"Night WORKTYPE C",
            HOLIDAY_WORKING_A:"Holiday WORKTYPE A",
            HOLIDAY_WORKING_B:"Holiday WORKTYPE B",
            HOLIDAY_WORKING_C:"Holiday WORKTYPE C",
            PERCEPTION:"Perception",
            SICK_LEAVE:"Sick Leave",
            ABSENTEEISM:"Absenteeism"
        }    
    }
});