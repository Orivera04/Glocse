using System;
using System.Collections.Generic;
using System.IO;
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
        
        public ActionResult Plantilla()
        {
            return File("~/Assets/Plantilla.xlsx", System.Net.Mime.MediaTypeNames.Application.Octet, Path.GetFileName("~/Assets/Plantilla.xlsx"));
        }
    }
}