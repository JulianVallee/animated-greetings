/**
 * The following declarations are required to
 * load vue SFCs from typescript test files
 */

declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}