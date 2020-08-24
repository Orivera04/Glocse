using System.Web;
using System.Web.Optimization;

namespace GLOCSE
{
    public class BundleConfig
    {        
        public static void RegisterBundles(BundleCollection bundles)
        {            
             bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/Estilos.css"));                                  
        }
    }
}
