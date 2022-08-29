import { con } from "../connections/dbConnection.js";

export async function updateBoth(genderPreference, expectation) {
  var sql = `SELECT UserId, Gender, SexualOrientation, Expectation FROM User;`;
  con.query(sql, function (err, result) {
    var userData = JSON.parse(JSON.stringify(result));
    //console.log(userData);
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].Gender == 0) {
        genderPreference["women"].add(userData[i].UserId);
      } else if (userData[i].Gender == 1) {
        genderPreference["men"].add(userData[i].UserId);
      } else if (userData[i].Gender == 2) {
        genderPreference["non_binary"].add(userData[i].UserId);
      }

      if (userData[i].SexualOrientation == 0) {
        genderPreference["hetero"].add(userData[i].UserId);
      } else if (userData[i].SexualOrientation == 1) {
        genderPreference["bisexual"].add(userData[i].UserId);
      } else if (userData[i].SexualOrientation == 2) {
        genderPreference["homo"].add(userData[i].UserId);
      } else if (userData[i].SexualOrientation == 3) {
        genderPreference["pansexual"].add(userData[i].UserId);
      } else if (userData[i].SexualOrientation == 4) {
        genderPreference["asexual"].add(userData[i].UserId);
      }

      if (userData[i].Expectation == 0) {
        expectation["takilmak"].add(userData[i].UserId);
      } else if (userData[i].Expectation == 1) {
        expectation["kisaSureli"].add(userData[i].UserId);
      } else if (userData[i].Expectation == 2) {
        expectation["uzunSureli"].add(userData[i].UserId);
      } else if (userData[i].Expectation == 3) {
        expectation["yeniArkadas"].add(userData[i].UserId);
      } else if (userData[i].Expectation == 4) {
        expectation["etkinlikBuddy"].add(userData[i].UserId);
      } else if (userData[i].Expectation == 5) {
        expectation["bilmiyorum"].add(userData[i].UserId);
      }
    }
  });
}

export async function updateGenderPreference(con, genderPreference) {
  var sql = `SELECT UserId, Gender, SexualOrientation FROM User;`;
  con.query(sql, function (err, result) {
    var userData = JSON.parse(JSON.stringify(result));
    //console.log(userData);
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].Gender == 0) {
        genderPreference["women"].add(userData[i].UserId);
      } else if (userData[i].Gender == 1) {
        genderPreference["men"].add(userData[i].UserId);
      } else if (userData[i].Gender == 2) {
        genderPreference["non_binary"].add(userData[i].UserId);
      }

      if (userData[i].SexualOrientation == 0) {
        genderPreference["hetero"].add(userData[i].UserId);
      } else if (userData[i].SexualOrientation == 1) {
        genderPreference["bisexual"].add(userData[i].UserId);
      } else if (userData[i].SexualOrientation == 2) {
        genderPreference["homo"].add(userData[i].UserId);
      } else if (userData[i].SexualOrientation == 3) {
        genderPreference["pansexual"].add(userData[i].UserId);
      } else if (userData[i].SexualOrientation == 4) {
        genderPreference["asexual"].add(userData[i].UserId);
      }
    }
  });
}

export async function updateExpectation(con, expectation) {
  var sql = `SELECT UserId, Expectation FROM User;`;
  con.query(sql, function (err, result) {
    var userData = JSON.parse(JSON.stringify(result));
    //console.log(userData);
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].Expectation == 0) {
        expectation["takilmak"].add(userData[i].UserId);
      } else if (userData[i].Expectation == 1) {
        expectation["kisaSureli"].add(userData[i].UserId);
      } else if (userData[i].Expectation == 2) {
        expectation["uzunSureli"].add(userData[i].UserId);
      } else if (userData[i].Expectation == 3) {
        expectation["yeniArkadas"].add(userData[i].UserId);
      } else if (userData[i].Expectation == 4) {
        expectation["etkinlikBuddy"].add(userData[i].UserId);
      } else if (userData[i].Expectation == 5) {
        expectation["bilmiyorum"].add(userData[i].UserId);
      }
    }
  });
}

export async function addUser(
  genderPreference,
  UserId,
  gender,
  SexualOrientation,
  expectationList,
  expectation
) {
  if (gender == 0) {
    genderPreference["women"].add(UserId);
  } else if (gender == 1) {
    genderPreference["men"].add(UserId);
  } else if (gender == 2) {
    genderPreference["non_binary"].add(UserId);
  }

  if (SexualOrientation == 0) {
    genderPreference["hetero"].add(UserId);
  } else if (SexualOrientation == 1) {
    genderPreference["bisexual"].add(UserId);
  } else if (SexualOrientation == 2) {
    genderPreference["homo"].add(UserId);
  } else if (SexualOrientation == 3) {
    genderPreference["pansexual"].add(UserId);
  } else if (SexualOrientation == 4) {
    genderPreference["asexual"].add(UserId);
  }

  if (expectation == 0) {
    expectationList["takilmak"].add(UserId);
  } else if (expectation == 1) {
    expectationList["kisaSureli"].add(UserId);
  } else if (expectation == 2) {
    expectationList["uzunSureli"].add(UserId);
  } else if (expectation == 3) {
    expectationList["yeniArkadas"].add(UserId);
  } else if (expectation == 4) {
    expectationList["etkinlikBuddy"].add(UserId);
  } else if (expectation == 5) {
    expectationList["bilmiyorum"].add(UserId);
  }
}

export async function deleteUser(
  genderPreference,
  UserId,
  gender,
  SexualOrientation,
  expectationList,
  expectation
) {
  if (gender == 0) {
    genderPreference["women"].delete(UserId);
  } else if (gender == 1) {
    genderPreference["men"].delete(UserId);
  } else if (gender == 2) {
    genderPreference["non_binary"].delete(UserId);
  }

  if (SexualOrientation == 0) {
    genderPreference["hetero"].delete(UserId);
  } else if (SexualOrientation == 1) {
    genderPreference["bisexual"].delete(UserId);
  } else if (SexualOrientation == 2) {
    genderPreference["homo"].delete(UserId);
  } else if (SexualOrientation == 3) {
    genderPreference["pansexual"].delete(UserId);
  } else if (SexualOrientation == 4) {
    genderPreference["asexual"].delete(UserId);
  }

  if (expectation == 0) {
    expectationList["takilmak"].delete(UserId);
  } else if (expectation == 1) {
    expectationList["kisaSureli"].delete(UserId);
  } else if (expectation == 2) {
    expectationList["uzunSureli"].delete(UserId);
  } else if (expectation == 3) {
    expectationList["yeniArkadas"].delete(UserId);
  } else if (expectation == 4) {
    expectationList["etkinlikBuddy"].delete(UserId);
  } else if (expectation == 5) {
    expectationList["bilmiyorum"].delete(UserId);
  }
}
