angular.module('Forbels.services', [])
// .constant('FrobelsApi', '')
.constant('FrobelsApi', 'http://www.frobelsedu.com')

.service('ContactusService', ['$q', '$http', 'FrobelsApi', function($q, $http, FrobelsApi) {
  this.contactUs = function(schoolId) {
    var requestParams = {
      schoolId: schoolId
    };

    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: FrobelsApi + '/webservices/getContactDetails.php',
      params: requestParams
    }).then(
      function(response) {
        deferred.resolve(response);
        console.log(response);
      },
      function(error) {
        deferred.reject(error);
      }
    );
    return deferred.promise;
  }
}])

.service('LoginService', ['$q', '$http', '$httpParamSerializerJQLike', '$sce', 'FrobelsApi', function($q, $http, $httpParamSerializerJQLike, $sce, FrobelsApi) {

  this.login = function(requestParams) {
    var dataObj = {
      username: requestParams.username,
      password: requestParams.password,
      token: requestParams.token
    }
    console.log(dataObj);
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: FrobelsApi + '/webservices/authUser.php',
      params: requestParams
    }).then(
      function(response) {
        deferred.resolve(response);
        console.log(response);
      },
      function(error) {
        deferred.reject(error);
      }
    );
    return deferred.promise;
  }

  this.changepassword = function(requestParams) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: FrobelsApi + '/webservices/changePassword.php',
      params: requestParams
    }).then(
      function(response) {
        deferred.resolve(response);
      },
      function(error) {
        deferred.reject(error);
      }
    );
    return deferred.promise;
  }

  this.forgotPassword = function(requestParams) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: FrobelsApi + '/webservices/forgotPassword.php',
      params: requestParams
    }).then(
      function(response) {
        deferred.resolve(response);
      },
      function(error) {
        deferred.reject(error);
      }
    );
    return deferred.promise;
  };
  // www.frobelsedu.com/webservices/forgotPassword.php
}])

.service('MessageService', ['$q', '$http', 'FrobelsApi', function($q, $http, FrobelsApi) {
  this.sendMessage = function() {
    var deferred = $q.defer(requestParams);
    $http({
      method: 'POST',
      url: FrobelsApi + '/webservices/parentTeacherChat.php',
      params: requestParams
    }).then(
      function(response) {
        deferred.resolve(response);
      },
      function(error) {
        deferred.reject(error);
      }
    );
    return deferred.promise;
  }

}])

// http://www.frobelsedu.com/webservices/parentTeacherChat.php
.service('AttendanceService', ['$q', '$http', 'FrobelsApi', function($q, $http, FrobelsApi) {

    this.getStudentAttendance = function(studentId) {
      var deferred = $q.defer();
      var reqParams = {
        studentId: studentId
      };
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getStudentAttendance.php',
        params: reqParams
      }).then(
        function(response) {
          deferred.resolve(response);
          console.log(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;

      // $http.get('www.frobelsedu.com/webservices/getstudentmarks.php?studentId=1&categoryId=1')
      // http://www.frobelsedu.com/webservices/getStudentAttendance.php
    };

    this.getStudentsByClassId = function(classId, session) {
      var deferred = $q.defer();
      var reqParams = {
        classId: classId,
        date: new Date(),
        session: session
      };
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getStudentsByClassId.php',
        params: reqParams
      }).then(
        function(response) {
          deferred.resolve(response);
          console.log(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;

      // $http.get('www.frobelsedu.com/webservices/getstudentmarks.php?studentId=1&categoryId=1')
      // http://www.frobelsedu.com/webservices/getStudentAttendance.php
    };

    this.insertStudentAttendance = function(requestParams) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/insertStudentAttendance.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
          console.log(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;

      // $http.get('www.frobelsedu.com/webservices/getstudentmarks.php?studentId=1&categoryId=1')
      // http://www.frobelsedu.com/webservices/getStudentAttendance.php
    };

    this.updateStudentAttendance = function(requestParams) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/updateStudentAttendance.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
          console.log(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;

      // $http.get('www.frobelsedu.com/webservices/getstudentmarks.php?studentId=1&categoryId=1')
      // http://www.frobelsedu.com/webservices/getStudentAttendance.php
    };

  }])

  .service('MarksService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {
    this.getStudentMarksNAttendance = function(studentId) {
      var deferred = $q.defer();
      var reqParams = {
        studentId: studentId
      };
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getStudentMarksNAttendance.php',
        params: reqParams
      }).then(
        function(response) {
          deferred.resolve(response);
          console.log(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;

      // $http.get('http://www.frobelsedu.com/webservices/getStudentMarksNAttendance.php?studentId=1')
    };
  }])

  .service('dashBoradService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {

    this.getImageGallery = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getImageGallery.php'
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

  }])

  .service('ChatService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {
    this.getTeachersList = function(studentId, parentId) {
      var deferred = $q.defer();
      var requestParams = {
        student_id: studentId,
        parent_id : parentId
      };
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getChatMembersForParent.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    this.getChat = function(requestParams) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
          url: FrobelsApi + '/webservices/getChat.php',
          //url: 'http://localhost/getChat.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    this.updatMessageRead = function(requestParams) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/updateMessageRead.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

  }])

  // www.frobelsedu.con/webservices/getChatMembers.php

  .service('ImageGalleryService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {
    this.getImageGallery = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getImageGallery.php'
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };
  }])

  .service('dashBoardSlidesService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {
    this.getImageSlides = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getSlideshowImages.php'
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };
  }])

  .service('ParentService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {
    this.feedetails = function(studentId) {
      var deferred = $q.defer();
      var requestParams = {
        studentId: studentId
      };
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getStudentFeeDetails.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    // http://frobelsedu.com/webservices/getStudentFeeDetails.php
  }])

  .service('NotificationService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {
    this.notifications = function(requestParams) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getNotifications.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    }
  }])

  .service('MessageService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {
    this.sendMessage = function(requestParams) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
       url: FrobelsApi + '/webservices/sendMessage.php',
       // url: 'http://localhost/sendMessage.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    }
  }])


  .service('TeacherService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {
    this.parentListForTeacher = function(teacherId,login_type) {
      var deferred = $q.defer();
      var requestParams = {
        teacher_id: teacherId,
        login_type:login_type
      };
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getChatMembersForTeacher.php',
        //url: 'http://localhost/getChatMembersForTeacher.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    this.searchparent = function(admNo) {
      var deferred = $q.defer();
      var requestParams = {
        admNo: admNo
      };
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getStudentProfile.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    // frobelsedu.com/webservices/getStudentProfile.php
    this.timetable = function(teacherId) {
      var deferred = $q.defer();
      var requestParams = {
        teacherId: teacherId
      };
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getTimeTableForTeacher.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    this.insertLeaveDetails = function(requestParams) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/insertLeaveDetails.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    this.getLeaveDetails = function(requestParams) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getLeaveDetails.php',
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    // http://www.frobelsedu.com/webservices/getTimeTableForTeacher.php
  }])

  .service('ProfileService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {
    this.viewProfileForStudent = function(studentId, parentId) {
      var deferred = $q.defer();
      var requestParams = {
        studentId: studentId,
        parent_id: parentId
      };
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getStudentProfile.php',
        // www.frobelsedu.com/webservices/getStudentProfile.php
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    this.viewTeacherProfile = function(teacherId) {
      var deferred = $q.defer();
      var requestParams = {
        teacherId: teacherId
      };
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getTeacherProfile.php',
        // www.frobelsedu.com/webservices/getTeacherProfile.php
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };
  }])

  .service('AssignmentService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {
    this.getAssignments = function(requestParams) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getAssignments.php',
        // http://www.frobelsedu.com/webservices/getAssignments.php
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    this.createAssignments = function(requestParams) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/createAssignment.php',
        // www.frobelsedu.com/webservices/createAssignment.php
        params: requestParams
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

    this.getListOfClassesAndSubjcts = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: FrobelsApi + '/webservices/getAllClassesNSubjects.php'
        // http://www.frobelsedu.com/webservices/getAllClassesNSubjects.php
      }).then(
        function(response) {
          deferred.resolve(response);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };

  }])

  .service('AdminService', ["$q", "$http", "FrobelsApi", function($q, $http, FrobelsApi) {

      this.getMarksForAdmin = function(requestParams) {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: FrobelsApi + '/webservices/getClassMarksForAdmin.php',
          // http://www.frobelsedu.com/webservices/createAnnouncement.php
          params: requestParams
        }).then(
          function(response) {
            deferred.resolve(response);
          },
          function(error) {
            deferred.reject(error);
          }
        );
        return deferred.promise;
      };

      this.feeDetails = function(requestParams) {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: FrobelsApi + '/webservices/getClassFeeForAdmin.php',
          // http://www.frobelsedu.com/webservices/createAnnouncement.php
          params: requestParams
        }).then(
          function(response) {
            deferred.resolve(response);
          },
          function(error) {
            deferred.reject(error);
          }
        );
        return deferred.promise;
      };

      this.createAssignment = function(requestParams) {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: FrobelsApi + '/webservices/createAnnouncement.php',
          // http://www.frobelsedu.com/webservices/createAnnouncement.php
          params: requestParams
        }).then(
          function(response) {
            deferred.resolve(response);
          },
          function(error) {
            deferred.reject(error);
          }
        );
        return deferred.promise;
      };

      this.getLeaveDetails = function() {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: FrobelsApi + '/webservices/getLeaveDetailsForAdmin.php',
          // http://www.frobelsedu.com/webservices/createAnnouncement.php
        }).then(
          function(response) {
            deferred.resolve(response);
          },
          function(error) {
            deferred.reject(error);
          }
        );
        return deferred.promise;
      };

      this.getAttendanceForAdmin = function(requestParams) {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: FrobelsApi + '/webservices/getClassAttendanceForAdmin.php',
          // http://www.frobelsedu.com/webservices/createAnnouncement.php
          params: requestParams
        }).then(
          function(response) {
            deferred.resolve(response);
          },
          function(error) {
            deferred.reject(error);
          }
        );
        return deferred.promise;
      };

      this.getClassMarksForAdmin = function() {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: FrobelsApi + '/webservices/getClassMarksForAdmin.php',
          // http://www.frobelsedu.com/webservices/createAnnouncement.php
        }).then(
          function(response) {
            deferred.resolve(response);
          },
          function(error) {
            deferred.reject(error);
          }
        );
        return deferred.promise;
      };


      this.updateLeaveDetails = function(requestParams) {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: FrobelsApi + '/webservices/updateLeaveDetails.php',
          // http://www.frobelsedu.com/webservices/createAnnouncement.php
          params: requestParams
        }).then(
          function(response) {
            deferred.resolve(response);
          },
          function(error) {
            deferred.reject(error);
          }
        );
        return deferred.promise;
      };

  }])

  // www.frobelsedu.com/webservices/getNotifications.php

// http://www.frobelsedu.com/webservices/getImageGallery.php
