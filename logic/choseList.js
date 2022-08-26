function addSet(setA, setB) {
  return new Set([...setA, ...setB]);
}

function getDifference(setA, setB) {
  return new Set([...setA].filter((element) => !setB.has(element)));
}

function getIntersection(setA, setB) {
  const intersection = new Set([...setA].filter((element) => setB.has(element)));

  return intersection;
}

export function choseList(genderPreference, gender, interestedSex, expectationList, expectation) {
  /* console.log("gender: " + gender);
  console.log("interestedSex: " + interestedSex); */

  var isFive = false;

  if (gender == 1 && interestedSex == 0) {
    var resultSet = addSet(genderPreference["women"], genderPreference["non_binary"]);
  } else if (gender == 1 && interestedSex == 1) {
    var resultSet = getDifference(genderPreference["men"], genderPreference["hetero"]);
  } else if (gender == 1 && interestedSex == 2) {
    var resultSet = getDifference(
      addSet(genderPreference["men"], genderPreference["women"]),
      getIntersection(genderPreference["hetero"], genderPreference["men"])
    );
  } else if (gender == 0 && interestedSex == 1) {
    var resultSet = addSet(genderPreference["men"], genderPreference["non_binary"]);
  } else if (gender == 0 && interestedSex == 0) {
    var resultSet = getDifference(genderPreference["women"], genderPreference["hetero"]);
  } else if (gender == 0 && interestedSex == 2) {
    var resultSet = getDifference(
      addSet(genderPreference["men"], genderPreference["women"]),
      getIntersection(genderPreference["hetero"], genderPreference["women"])
    );
  } else if (gender == 2 && interestedSex == 1) {
    var resultSet = addSet(genderPreference["men"], genderPreference["non_binary"]);
  } else if (gender == 2 && interestedSex == 0) {
    var resultSet = addSet(genderPreference["women"], genderPreference["non_binary"]);
  } else if (gender == 2 && interestedSex == 2) {
    var resultSet = getDifference(
      addSet(genderPreference["women"], genderPreference["men"]),
      genderPreference["hetero"]
    );
  }

  if (expectation == 0) {
    var expectResult = addSet(
      addSet(expectationList["takilmak"], expectationList["kisaSureli"]),
      expectationList["bilmiyorum"]
    );
  } else if (expectation == 1) {
    var expectResult = addSet(
      addSet(expectationList["kisaSureli"], expectationList["takilmak"]),
      addSet(expectationList["uzunSureli"], expectationList["bilmiyorum"])
    );
  } else if (expectation == 2) {
    var expectResult = addSet(
      addSet(expectationList["uzunSureli"], expectationList["kisaSureli"]),
      expectationList["bilmiyorum"]
    );
  } else if (expectation == 3) {
    var expectResult = addSet(
      addSet(expectationList["yeniArkadas"], expectationList["etkinlikBuddy"]),
      expectationList["bilmiyorum"]
    );
  } else if (expectation == 4) {
    var expectResult = addSet(
      addSet(expectationList["etkinlikBuddy"], expectationList["yeniArkadas"]),
      expectationList["bilmiyorum"]
    );
  } else if (expectation == 5) {
    var finalResult = resultSet;
    isFive = true;
  }

  if (!isFive) {
    var finalResult = getIntersection(resultSet, expectResult);
  }

  return Array.from(finalResult);
}
