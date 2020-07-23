const core = require("@actions/core");
const github = require("@actions/github");
const xmlpoke = require("xmlpoke");

const addns = (xml, ns, alias) => {
  if (ns !== undefined) xml.addNamespace(alias, ns);
};

try {
  const fileGlob = core.getInput("file-glob");
  const select = core.getInput("select");
  const set = core.getInput("set");
  const clear = core.getInput("clear");
  const remove = core.getInput("remove");
  const namespace = core.getInput("namespace");
  const namespaceAlias = core.getInput("namespace-alias");
  console.log(`Processing file ${fileGlob}`);
  console.log(`Search  ${select}`);
  console.log(`Replace ${set}`);
  console.log(`Clear ${clear}`);
  console.log(`Remoce ${remove}`);

  if (set !== undefined) {
    xmlpoke(fileGlob, function (xml) {
      addns(xml, namespace, namespaceAlias);
      xml.set("data/connString", "server=oh;db=hai");
    });
  }

  if (clear !== undefined) {
    addns(xml, namespace, namespaceAlias);
    xmlpoke(fileGlob, function (xml) {
      xml.clear(clear);
    });
  }

  if (remove !== undefined) {
    addns(xml, namespace, namespaceAlias);
    xmlpoke(fileGlob, function (xml) {
      xml.remove(remove);
    });
  }

  core.setOutput("result", "Done");

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
