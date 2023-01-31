/* 
This page performs set operations on categorised user IDs so the cost of user data retreival 
from the database is reduced.
*/

function addSet(setA, setB) {
  return new Set([...setA, ...setB]);
}
function add6set(set1, set2, set3, set4, set5, set6) {
  return new Set([...set1, ...set2, ...set3, ...set4, ...set5, ...set6]);
}

function getDifference(setA, setB) {
  return new Set([...setA].filter((element) => !setB.has(element)));
}

function getIntersection(setA, setB) {
  try {
    const intersection = new Set([...setA].filter((element) => setB.has(element)));

    return intersection;
  } catch (err) {
    console.log(err);
  }
}

export function choseList(genderPreference, gender, interestedSex, expectationList, expectation) {
  /* console.log("gender: " + gender);
  console.log("interestedSex: " + interestedSex); */

  var isFive = false;
  var finalResult = [];
  var resultSet;

  if (gender == 1 && interestedSex == 0) {
    resultSet = addSet(genderPreference["women"], genderPreference["non_binary"]);
  } else if (gender == 1 && interestedSex == 1) {
    resultSet = getDifference(genderPreference["men"], genderPreference["hetero"]);
  } else if (gender == 1 && interestedSex == 2) {
    resultSet = getDifference(
      addSet(genderPreference["men"], genderPreference["women"]),
      getIntersection(genderPreference["hetero"], genderPreference["men"])
    );
  } else if (gender == 0 && interestedSex == 1) {
    resultSet = addSet(genderPreference["men"], genderPreference["non_binary"]);
  } else if (gender == 0 && interestedSex == 0) {
    resultSet = getDifference(genderPreference["women"], genderPreference["hetero"]);
  } else if (gender == 0 && interestedSex == 2) {
    resultSet = getDifference(
      addSet(genderPreference["men"], genderPreference["women"]),
      getIntersection(genderPreference["hetero"], genderPreference["women"])
    );
  } else if (gender == 2 && interestedSex == 1) {
    resultSet = addSet(genderPreference["men"], genderPreference["non_binary"]);
  } else if (gender == 2 && interestedSex == 0) {
    resultSet = addSet(genderPreference["women"], genderPreference["non_binary"]);
  } else if (gender == 2 && interestedSex == 2) {
    resultSet = getDifference(
      addSet(genderPreference["women"], genderPreference["men"]),
      genderPreference["hetero"]
    );
  }

  if (expectation == 1) {
    var expectResult = add6set(
      expectationList["takilmak"],
      expectationList["kisaSureli"],
      expectationList["bilmiyorum"],
      expectationList["yeniArkadas"],
      expectationList["etkinlikBuddy"],
      expectationList["uzunSureli"]
    );
  } else if (expectation == 2) {
    var expectResult = add6set(
      expectationList["kisaSureli"],
      expectationList["takilmak"],
      expectationList["uzunSureli"],
      expectationList["bilmiyorum"],
      expectationList["yeniArkadas"],
      expectationList["etkinlikBuddy"]
    );
  } else if (expectation == 3) {
    var expectResult = add6set(
      expectationList["uzunSureli"],
      expectationList["kisaSureli"],
      expectationList["bilmiyorum"],
      expectationList["yeniArkadas"],
      expectationList["etkinlikBuddy"],
      expectationList["takilmak"]
    );
  } else if (expectation == 4) {
    var expectResult = add6set(
      expectationList["yeniArkadas"],
      expectationList["etkinlikBuddy"],
      expectationList["bilmiyorum"],
      expectationList["uzunSureli"],
      expectationList["kisaSureli"],
      expectationList["takilmak"]
    );
  } else if (expectation == 5) {
    var expectResult = add6set(
      expectationList["etkinlikBuddy"],
      expectationList["yeniArkadas"],
      expectationList["bilmiyorum"],
      expectationList["uzunSureli"],
      expectationList["kisaSureli"],
      expectationList["takilmak"]
    );
  } else if (expectation == 6) {
    finalResult = resultSet;
    isFive = true;
  }

  if (!isFive && expectResult != undefined && resultSet != undefined) {
    var finalResult = getIntersection(resultSet, expectResult);
  }

  return Array.from(finalResult);
}
