using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GLOCSE.Controllers
{
    public class SimuladorController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Titulo = "GLOCSE - Subestación";
            return View();
        }
        
        
    }
}